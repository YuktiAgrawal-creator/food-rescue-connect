import psycopg2
import os

passwords = ["postgres", "", "admin", "root", "password", "123456"]
success_password = None

for pwd in passwords:
    try:
        conn = psycopg2.connect(
            dbname="postgres", # connect to default db first to check credentials
            user="postgres",
            password=pwd,
            host="localhost",
            port="5432"
        )
        print(f"SUCCESS with password: '{pwd}'")
        success_password = pwd
        conn.close()
        break
    except psycopg2.OperationalError as e:
        # print(f"Failed with '{pwd}': {e}")
        pass

if success_password is not None:
    # Now check if food_rescue db exists
    try:
        conn = psycopg2.connect(
            dbname="food_rescue",
            user="postgres",
            password=success_password,
            host="localhost",
            port="5432"
        )
        print("Database 'food_rescue' exists.")
        conn.close()
    except psycopg2.OperationalError as e:
        print(f"Database 'food_rescue' does not exist or error: {e}")
        # Try to create it
        print("Attempting to create 'food_rescue' database...")
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password=success_password,
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cur = conn.cursor()
        try:
            cur.execute("CREATE DATABASE food_rescue;")
            print("Successfully created 'food_rescue' database.")
        except Exception as create_e:
            print(f"Failed to create database: {create_e}")
        cur.close()
        conn.close()
else:
    print("Could not connect with any common password.")
