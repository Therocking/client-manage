package repository

import (
	"client-manager-api/models"
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
)

type PostgresUserRepository struct {
	db          *sql.DB
	addressRepo AddressRepository
}

func NewPostgresUserRepository(db *sql.DB, addressRepo AddressRepository) *PostgresUserRepository {
	return &PostgresUserRepository{
		db:          db,
		addressRepo: addressRepo,
	}
}

func (r *PostgresUserRepository) GetAll(ctx context.Context, embedAddresses bool) ([]models.User, error) {
	if !embedAddresses {
		return r.getAllUsers(ctx)
	}
	return r.getAllUsersWithAddresses(ctx)
}

func (r *PostgresUserRepository) GetByID(ctx context.Context, id string) (models.User, error) {
	var u models.User

	err := r.db.QueryRowContext(ctx, `
		SELECT id, first_name, last_name, email, photo 
		FROM users WHERE id = $1`, id,
	).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Photo)

	if errors.Is(err, sql.ErrNoRows) {
		return models.User{}, errors.New("user not found")
	}
	if err != nil {
		return models.User{}, err
	}

	return u, nil
}

func (r *PostgresUserRepository) Create(ctx context.Context, u models.User) (models.User, error) {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}

	err := r.db.QueryRowContext(ctx, `
		INSERT INTO users (id, first_name, last_name, email, photo) 
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`,
		u.ID, u.FirstName, u.LastName, u.Email, u.Photo,
	).Scan(&u.ID)

	if err != nil {
		return models.User{}, err
	}

	return u, nil
}

func (r *PostgresUserRepository) Update(ctx context.Context, id string, u models.User) (models.User, error) {
	result, err := r.db.ExecContext(ctx, `
		UPDATE users 
		SET first_name = $1, last_name = $2, email = $3, photo = $4 
		WHERE id = $5`,
		u.FirstName, u.LastName, u.Email, u.Photo, id,
	)
	if err != nil {
		return models.User{}, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return models.User{}, err
	}

	if rowsAffected == 0 {
		return models.User{}, errors.New("user not found")
	}

	u.ID = id
	return u, nil
}

func (r *PostgresUserRepository) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `
		DELETE FROM users WHERE id = $1`, id,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *PostgresUserRepository) getAllUsersWithAddresses(ctx context.Context) ([]models.User, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT 
			u.id, u.first_name, u.last_name, u.email, u.photo,
			a.id, a.street, a.city, a.country, a.zip, a.user_id
		FROM users u
		LEFT JOIN addresses a ON a.user_id = u.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	userMap := make(map[string]*models.User)

	for rows.Next() {
		var u models.User

		var a models.Address
		var addressID sql.NullString
		var street, city, country, zip, userID sql.NullString

		err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Photo,
			&addressID, &street, &city, &country, &zip, &userID,
		)
		if err != nil {
			return nil, err
		}

		if _, exists := userMap[u.ID]; !exists {
			u.Addresses = []models.Address{}
			userMap[u.ID] = &u
		}

		if addressID.Valid {
			a.ID = addressID.String
			a.Street = street.String
			a.City = city.String
			a.Country = country.String
			a.Zip = zip.String
			a.UserID = userID.String

			userMap[u.ID].Addresses = append(userMap[u.ID].Addresses, a)
		}
	}

	var users []models.User
	for _, u := range userMap {
		users = append(users, *u)
	}

	return users, rows.Err()
}

func (r *PostgresUserRepository) getAllUsers(ctx context.Context) ([]models.User, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, first_name, last_name, email, photo 
		FROM users`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Photo); err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, rows.Err()
}
