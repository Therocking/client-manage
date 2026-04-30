package handlers

import (
	"client-manager-api/models"
	"client-manager-api/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type AddressHandler struct {
	repo     repository.AddressRepository
	validate *validator.Validate
}

func NewAddressHandler(repo repository.AddressRepository) *AddressHandler {
	return &AddressHandler{
		repo:     repo,
		validate: validator.New(),
	}
}

func (h *AddressHandler) GetAddresses(c *gin.Context) {
	userId := c.Query("userId")
	if userId != "" {
		addresses, err := h.repo.GetByUserID(c, userId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, addresses)
		return
	}
	addresses, err := h.repo.GetAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, addresses)
}

func (h *AddressHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	address, err := h.repo.GetByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(http.StatusOK, address)
}

func (h *AddressHandler) Create(c *gin.Context) {
	var input struct {
		models.AddressFormData
		UserID string `json:"userId" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validate.Struct(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address := models.Address{
		Street:  input.Street,
		City:    input.City,
		Country: input.Country,
		Zip:     input.Zip,
		UserID:  input.UserID,
	}

	createdAddress, err := h.repo.Create(c, address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdAddress)
}

func (h *AddressHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var input models.AddressFormData

	existingAddress, err := h.repo.GetByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Street != "" {
		existingAddress.Street = input.Street
	}
	if input.City != "" {
		existingAddress.City = input.City
	}
	if input.Country != "" {
		existingAddress.Country = input.Country
	}
	if input.Zip != "" {
		existingAddress.Zip = input.Zip
	}

	updatedAddress, err := h.repo.Update(c, id, existingAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedAddress)
}

func (h *AddressHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.Delete(c, id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
