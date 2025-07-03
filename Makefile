.PHONY: infra systems down purge all logs status rebuild

# stand up all infrstructure (Rabbitmq and Database)
infra:
	docker-compose up db 

#stand up all APIs
systems:
	docker-compose up

# clean all volumes
down:
	docker-compose down --volumes --rmi all

# purge the build
purge:
	docker builder prune -a -f

all: infra infra-w systems system_wg

# Get All Servers Logs
logs:
	docker-compose logs -f

# get one server logs
logs-%:
	docker-compose logs -f $*

# get status docker
status:
	docker-compose ps

# stand up all system
rebuild:
	docker-compose up --build -d