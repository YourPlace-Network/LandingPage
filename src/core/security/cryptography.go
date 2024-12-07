package security

import (
	"crypto/rand"
	"io"
)

func RandomBytes(length int) []byte {
	byteArray := make([]byte, length)
	_, err := io.ReadFull(rand.Reader, byteArray)
	if err != nil {
		return nil
	}
	return byteArray
}
