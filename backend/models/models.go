package models

type User struct {
	ID        string    `json:"id"`
	FirstName string    `json:"firstName" validate:"required"`
	LastName  string    `json:"lastName" validate:"required"`
	Email     string    `json:"email" validate:"required,email"`
	Photo     string    `json:"photo"`
	Addresses []Address `json:"addresses"`
}

type Address struct {
	ID      string `json:"id"`
	Street  string `json:"street" validate:"required"`
	City    string `json:"city" validate:"required"`
	Country string `json:"country" validate:"required"`
	Zip     string `json:"zip" validate:"required"`
	UserID  string `json:"userId"`
}

type UserFormData struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Photo     string `json:"photo"`
}

type AddressFormData struct {
	Street  string `json:"street" validate:"required"`
	City    string `json:"city" validate:"required"`
	Country string `json:"country" validate:"required"`
	Zip     string `json:"zip" validate:"required"`
}
