package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/smtp"
	"os"
)

// GenerateOTP generates a 6-digit OTP
func GenerateOTP() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

// SendOTPEmail sends an OTP to the user's email
func SendOTPEmail(to, otp string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	// If SMTP is not configured, log the OTP (for development)
	if from == "" || password == "" || smtpHost == "" || smtpPort == "" {
		fmt.Printf("SMTP not configured. OTP for %s: %s\n", to, otp)
		return nil
	}

	subject := "Subject: Password Reset OTP\n"
	body := fmt.Sprintf("Your OTP for password reset is: %s\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.", otp)
	message := []byte(subject + "\n" + body)

	auth := smtp.PlainAuth("", from, password, smtpHost)
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	err := smtp.SendMail(addr, auth, from, []string{to}, message)
	if err != nil {
		fmt.Printf("Failed to send email: %v. OTP for %s: %s\n", err, to, otp)
		return err
	}

	return nil
}
