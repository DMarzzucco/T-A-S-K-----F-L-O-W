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


## kubernetes


## init kube
kube-start:
	minikube start

## add TSL ceritificate 
tsl-cert:
	kubectl create secret generic cert-secret --from-file=./certs/cert.pfx

# desplegar postgresql 
kube-sql:
	kubectl apply -f postgres.yaml

# deploy container in  minikube 
init-server:
	docker build -t task-flow:latest -f Dockerfile . 

# load image to minikube
load-image:
	minikube image load task-flow:latest

# desplegar server
kube-server:
	kubectl apply -f server.yaml

# deploy minikube
start:
	minikube service task-flow

# log status in minikube 
status:
	minikube status

#stop production
stop-production:
	minikube stop

rem-nodos:
	minikube delete