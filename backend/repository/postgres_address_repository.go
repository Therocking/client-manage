package repository

import (
	"client-manager-api/models"
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
)

type PostgresAddressRepository struct {
	db *sql.DB
}

func NewPostgresAddressRepository(db *sql.DB) *PostgresAddressRepository {
	return &PostgresAddressRepository{db: db}
}

func (r *PostgresAddressRepository) GetAll(ctx context.Context) ([]models.Address, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, street, city, country, zip, user_id 
		FROM addresses`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var addresses []models.Address
	for rows.Next() {
		var a models.Address
		if err := rows.Scan(&a.ID, &a.Street, &a.City, &a.Country, &a.Zip, &a.UserID); err != nil {
			return nil, err
		}
		addresses = append(addresses, a)
	}

	return addresses, rows.Err()
}

func (r *PostgresAddressRepository) GetByID(ctx context.Context, id string) (models.Address, error) {
	var a models.Address

	err := r.db.QueryRowContext(ctx, `
		SELECT id, street, city, country, zip, user_id 
		FROM addresses WHERE id = $1`,
		id,
	).Scan(&a.ID, &a.Street, &a.City, &a.Country, &a.Zip, &a.UserID)

	if errors.Is(err, sql.ErrNoRows) {
		return models.Address{}, errors.New("address not found")
	}
	if err != nil {
		return models.Address{}, err
	}

	return a, nil
}

func (r *PostgresAddressRepository) GetByUserID(ctx context.Context, userID string) ([]models.Address, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, street, city, country, zip, user_id 
		FROM addresses WHERE user_id = $1`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// 👇 importante: inicializar slice vacío
	addresses := []models.Address{}

	for rows.Next() {
		var a models.Address
		if err := rows.Scan(&a.ID, &a.Street, &a.City, &a.Country, &a.Zip, &a.UserID); err != nil {
			return nil, err
		}
		addresses = append(addresses, a)
	}

	return addresses, rows.Err()
}

func (r *PostgresAddressRepository) Create(ctx context.Context, a models.Address) (models.Address, error) {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}

	err := r.db.QueryRowContext(ctx, `
		INSERT INTO addresses (id, street, city, country, zip, user_id) 
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`,
		a.ID, a.Street, a.City, a.Country, a.Zip, a.UserID,
	).Scan(&a.ID)

	if err != nil {
		return models.Address{}, err
	}

	return a, nil
}

func (r *PostgresAddressRepository) Update(ctx context.Context, id string, a models.Address) (models.Address, error) {
	result, err := r.db.ExecContext(ctx, `
		UPDATE addresses 
		SET street = $1, city = $2, country = $3, zip = $4, user_id = $5 
		WHERE id = $6`,
		a.Street, a.City, a.Country, a.Zip, a.UserID, id,
	)
	if err != nil {
		return models.Address{}, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return models.Address{}, err
	}

	if rowsAffected == 0 {
		return models.Address{}, errors.New("address not found")
	}

	a.ID = id
	return a, nil
}

func (r *PostgresAddressRepository) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `
		DELETE FROM addresses WHERE id = $1`,
		id,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("address not found")
	}

	return nil
}
