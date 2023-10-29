from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.view import view_config
import jwt
import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='produk',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)
@view_config(route_name='index', renderer='json',  request_method="GET")
def index(request):
    return {
        'message': 'Server Running!',
        'description': 'Hello World!'
    }


def auth_jwt_verify(request):
    authentication_header = request.cookies.get('token')
    if authentication_header:
        try:
            decoded_user = jwt.decode(
                authentication_header, 'secret', algorithms=['HS256'])
            with connection.cursor() as cursor:
                sql = "SELECT jwt_token FROM tokens WHERE user_id=%s"
                cursor.execute(sql, (decoded_user['sub'],))
                result = cursor.fetchone()
            if result:
                return decoded_user
        except jwt.ExpiredSignatureError:
            request.response.status = 401  # Unauthorized
    return None


@view_config(route_name='product', renderer="json", request_method="GET")
def product(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "SELECT id,nama,harga,deskripsi FROM produk WHERE user_id=%s"
            cursor.execute(sql, (auth_user['sub'],))
            result = cursor.fetchall()

        data = {}
        for item in result:
            data[item['id']] = {
                'id': item['id'],
                'nama': item['nama'],
                'harga': item['harga'],
                'deskripsi': item['deskripsi'],
            }
        return {
            'message': 'ok',
            'description': 'Get data success!',
            'data': data
        }
    else:
        request.response.status = 401  # Unauthorized
        return {'message': 'Unauthorized', 'description': 'token not found'}


@view_config(route_name='create-data', request_method='POST', renderer="json")
def Produk_create(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "INSERT INTO Produk (nama, harga, deskripsi) VALUES (%s, %s, %s)"
            cursor.execute(sql, (request.POST['nama'], request.POST['harga'],request.POST['deskripsi'], auth_user['sub'],))
            connection.commit()
        return {'message': 'ok', 'description': 'berhasil buat data ', 'data': [request.POST['nama'], request.POST['harga'],request.POST['deskripsi']]}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token not found'}


@view_config(route_name='delete-data', request_method='DELETE', renderer="json")
def Produk_delete(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "SELECT id,nama,harga,deskripsi FROM Produk WHERE user_id=%s"
            cursor.execute(sql, (auth_user['sub'],))
            result = cursor.fetchall()
            data = {}
            for item in result:
                data = {
                'id': item['id'],
                'nama': item['nama'],
                'harga': item['harga'],
                'deskripsi': item['deskripsi'],
                }
            sql = "DELETE FROM Produk WHERE id=%s"
            cursor.execute(sql, (request.POST['id']))
            connection.commit()
        return {'message': 'ok', 'description': 'hapus data berhasil', 'data': data}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token not found'}



@view_config(route_name='update-data', request_method='PUT', renderer="json")
def Produk_update(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "UPDATE Produk SET nama=%s, harga=%s, deskripsi=%s WHERE id=%s"
            cursor.execute(sql, (request.POST['nama'], request.POST['harga'],
                           request.POST['deskripsi'], auth_user['sub'], request.POST['id']))
            connection.commit()
            return {'message': 'ok', 'description': 'berhasil buat data', 'data': [request.POST['nama'], request.POST['harga'],request.POST['deskripsi'],]}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token not found'}



if __name__ == "__main__":
    with Configurator() as config:
        config = Configurator(settings={'jwt.secret': 'secret'})
        config.add_route('index', '/')
        config.add_route('product', '/product')
        config.add_route('create-data', '/create')
        config.add_route('update-data', '/update')
        config.add_route('delete-data', '/delete')
        config.scan()
        app = config.make_wsgi_app()
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()
