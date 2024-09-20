set -e

echo "Waiting for the database to be ready..."

until nc -z -v -w30 db 5432
do
  echo "Waiting for database connection..."
  sleep 15
done

echo "Database is up - executing commands"
exec "$@"