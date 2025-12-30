package config

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB(ctx context.Context) error {
	mongoURI := os.Getenv("MONGODB_URI")
	dbName := os.Getenv("DB_NAME")

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping the database
	if err := client.Ping(ctx, nil); err != nil {
		return err
	}

	DB = client.Database(dbName)
	return nil
}

func DisconnectDB(ctx context.Context) error {
	if DB != nil {
		return DB.Client().Disconnect(ctx)
	}
	return nil
}

func GetCollection(collectionName string) *mongo.Collection {
	return DB.Collection(collectionName)
}
