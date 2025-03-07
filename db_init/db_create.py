import psycopg2
from psycopg2 import Error
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def connect_to_db():
    try:
        # Get database credentials from environment variables
        db_params = {
            'dbname': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'sslmode': os.getenv('DB_SSLMODE')
        }
        
        # Establish connection
        connection = psycopg2.connect(**db_params)
        return connection
    except Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None

def create_tables():
    try:
        # Connect to database
        connection = connect_to_db()
        if connection is None:
            return
        
        # Create a cursor object
        cursor = connection.cursor()
        
        # Create Roles Enum Type
        cursor.execute("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
                    CREATE TYPE role_type AS ENUM ('1', '2', '3');
                END IF;
            END$$;
        """)
        
        # Create Order Status Enum Type
        cursor.execute("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_type') THEN
                    CREATE TYPE order_status_type AS ENUM ('0', '1', '2', '3', '4', '5');
                END IF;
            END$$;
        """)
        
        # Create User Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                contact_number BIGINT,
                email VARCHAR(255) UNIQUE,
                role role_type NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create Product Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id SERIAL PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                product_category VARCHAR(255),
                product_description TEXT,
                product_weight INTEGER,
                product_price INTEGER NOT NULL,
                stock_quantity INTEGER NOT NULL,
                seasonal_availability BOOLEAN DEFAULT FALSE,
                images TEXT[],
                ratings FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create Cart Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cart (
                cart_id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                products JSONB,
                expires_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create Order Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                order_id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                products JSONB,
                total_order_price INTEGER,
                order_status order_status_type DEFAULT '3',
                delivery_address VARCHAR(255),
                payment_details JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create Order History Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS order_history (
                history_id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                orders JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Commit the transaction
        connection.commit()
        print("Tables created successfully!")
        
    except Error as e:
        print(f"Error creating tables: {e}")
        if connection:
            connection.rollback()
            
    finally:
        # Close database connection
        if connection:
            cursor.close()
            connection.close()
            print("Database connection closed.")

if __name__ == "__main__":
    create_tables()