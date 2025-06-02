.PHONY: start infra

# stand up all aplication
start:
  docker-compose up 

# start db 
infra:
  docker-compose up db 

all: start infra 

