package config

import (
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

var CloudinaryInstance *cloudinary.Cloudinary

func InitCloudinary() error {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return err
	}
	CloudinaryInstance = cld
	return nil
}
