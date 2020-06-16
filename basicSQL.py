#mariadb  pip install mysql-connector
# https://www.w3schools.com/python/python_mysql_where.asp
import mysql.connector


mydb = mysql.connector.connect(
  host="localhost",
  user="pqv",
  passwd="pqv"
  database="Dafity1"
)
mycursor = mydb.cursor()
mycursor.execute("CREATE DATABASE mydatabase")

mycursor.execute("Show tables")
mycursor.execute("CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))")

sql = "INSERT INTO customers (name, address) VALUES (%s, %s)"
val = ("John", "Highway 21")
mycursor.execute(sql, val)
# o
mycursor.execute("INSERT INTO customers (name, address) VALUES ('ee', 'rr')")
mydb.commit()
print(mycursor.rowcount, "record inserted.")

mycursor.execute("SELECT * FROM customers")
myresult = mycursor.fetchall() 
for x in myresult:
  print(x)
  
