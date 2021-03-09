

tabla = "profesions_acp"
host = "localhost"
user = "root"
password = ""
database = "finanservs"
 
# import pandas as pd
# xls = pd.read_excel(fichero)
# print(xls.columns)
# values = xls['Titulo'].values
# print(values)

# import pandas as pd
# xls = pd.ExcelFile(fichero)
# print(xls.sheet_names)
# df = xls.parse('Original')
# print(df)


import mysql.connector

def insert_acp(id, titulo, grupo, segmento):
    try:
        cnn = mysql.connector.connect(
            host='localhost',
            database='finanservs',
            user='rsanchez',
            password='cafekotowa'
        )

        cursor = cnn.cursor()
        mySql_insert_query = "INSERT INTO profesions_acp (id,titulo,grupo,segmento) VALUES (%s,%s,%s,%s)"

        record = (id,titulo,grupo,segmento)
        cursor.execute(mySql_insert_query, record)
        cnn.commit()
        print("Record inserted!")
    except mysql.connector.Error as error:
        print("Failed to insert into MySQL table {}".format(error))
    
    finally:
        if cnn.is_connected():
            cursor.close()
            cnn.close()
            print("MySQL connection is closed")

def insert_lw(id, titulo):
    try:
        cnn = mysql.connector.connect(
            host='localhost',
            database='finanservs',
            user='rsanchez',
            password='cafekotowa'
        )

        cursor = cnn.cursor()
        mySql_insert_query = "INSERT INTO profesions_lw (id,titulo) VALUES (%s,%s)"

        record = (id,titulo)
        cursor.execute(mySql_insert_query, record)
        cnn.commit()
        print("Record inserted!")
    except mysql.connector.Error as error:
        print("Failed to insert into MySQL table {}".format(error))
    
    finally:
        if cnn.is_connected():
            cursor.close()
            cnn.close()
            print("MySQL connection is closed")

def insert_inst(id, name):
    try:
        cnn = mysql.connector.connect(
            host='localhost',
            database='finanservs',
            user='rsanchez',
            password='cafekotowa'
        )

        cursor = cnn.cursor()
        mySql_insert_query = "INSERT INTO institutions (id,name) VALUES (%s,%s)"

        record = (id,name)
        cursor.execute(mySql_insert_query, record)
        cnn.commit()
        print("Record inserted!")
    except mysql.connector.Error as error:
        print("Failed to insert into MySQL table {}".format(error))
    
    finally:
        if cnn.is_connected():
            cursor.close()
            cnn.close()
            print("MySQL connection is closed")

def insert_plan(id, name):
    try:
        cnn = mysql.connector.connect(
            host='localhost',
            database='finanservs',
            user='rsanchez',
            password='cafekotowa'
        )

        cursor = cnn.cursor()
        mySql_insert_query = "INSERT INTO planillas_j (id,name) VALUES (%s,%s)"

        record = (id,name)
        cursor.execute(mySql_insert_query, record)
        cnn.commit()
        print("Record inserted!")
    except mysql.connector.Error as error:
        print("Failed to insert into MySQL table {}".format(error))
    
    finally:
        if cnn.is_connected():
            cursor.close()
            cnn.close()
            print("MySQL connection is closed")

# insert('Caja del Seguro Social')
# insert('Loteria Nacional de Beneficencia')




# # librerias para correos
# import smtplib, ssl
# import getpass
# libresia para excel
import openpyxl

# # credenciales de la cuenta de correo
# username = input("Ingrese su nombre de usuario: ")
# password = getpass.getpass("Ingrese su password: ")

# # Crear la conexion
# context = ssl.create_default_context()

# with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
#     server.login(username, password)
#     print("Inició sesión")

#     destino = "email"
#     mensaje = "Cuerpo del correo"
#     server.sendmail(username, destino, mensaje)

fichero = r"D:\Documentos\Desarrollo Web\Finanservs\Profesiones_ACP.xlsx"

book = openpyxl.load_workbook(fichero, data_only=True)
hoja = book.active

celdas = hoja['A2' : 'D750']

for fila in celdas:
    data = [celda.value for celda in fila]
    insert_acp(data[0], data[1], data[2], data[3])


fichero = r"D:\Documentos\Desarrollo Web\Finanservs\Profesiones_Linea_Blanca.xlsx"

book = openpyxl.load_workbook(fichero, data_only=True)
hoja = book.active

celdas = hoja['A5' : 'B105']

for fila in celdas:
    data = [celda.value for celda in fila]
    insert_lw(data[0], data[1])


fichero = r"D:\Documentos\Desarrollo Web\Finanservs\Instituciones.xlsx"

book = openpyxl.load_workbook(fichero, data_only=True)
hoja = book.active

celdas = hoja['A3' : 'B9']

for fila in celdas:
    data = [celda.value for celda in fila]
    insert_inst(data[0], data[1])


fichero = r"D:\Documentos\Desarrollo Web\Finanservs\Planillas_Jubilados.xlsx"

book = openpyxl.load_workbook(fichero, data_only=True)
hoja = book.active

celdas = hoja['A3' : 'B15']

for fila in celdas:
    data = [celda.value for celda in fila]
    insert_plan(data[0], data[1])