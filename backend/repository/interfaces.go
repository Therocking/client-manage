package repository

import (
	"client-manager-api/models"
	"context"
)

type UserRepository interface {
	GetAll(ctx context.Context, embedAddresses bool) ([]models.User, error)
	GetByID(ctx context.Context, id string) (models.User, error)
	Create(ctx context.Context, u models.User) (models.User, error)
	Update(ctx context.Context, id string, u models.User) (models.User, error)
	Delete(ctx context.Context, id string) error
}

type AddressRepository interface {
	GetAll(ctx context.Context) ([]models.Address, error)
	GetByID(ctx context.Context, id string) (models.Address, error)
	GetByUserID(ctx context.Context, userID string) ([]models.Address, error)
	Create(ctx context.Context, a models.Address) (models.Address, error)
	Update(ctx context.Context, id string, a models.Address) (models.Address, error)
	Delete(ctx context.Context, id string) error
}
