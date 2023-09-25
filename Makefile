ENV_FILE := .env
include $(ENV_FILE)
export $(shell sed 's/=.*//' $(ENV_FILE))

# make run
run: build_local_docker_image
	@docker-compose -f ./docker-compose.local.yml up --remove-orphans

deploy: set_env push_linux_docker_image
	@gcloud run deploy ${PROJECT_ID}-${PROJECT_NAME}-cloudrun-app --image asia.gcr.io/$(PROJECT_ID)/$(PROJECT_NAME)/app:latest --platform=managed --region=${REGION} --allow-unauthenticated

build_local_docker_image:
	@docker build \
		--build-arg GITHUB_REPO_URL=$(GITHUB_REPO_URL) \
		--build-arg GITHUB_ACCESS_TOKEN=$(GITHUB_ACCESS_TOKEN) \
		--build-arg GOLLUM_APP_USE_BRANCH=$(GOLLUM_APP_USE_BRANCH) \
		-f ./docker/app/Dockerfile \
		-t gollum-app:local ./docker/app

build_linux_docker_image:
	@docker build \
		--build-arg GITHUB_REPO_URL=$(GITHUB_REPO_URL) \
		--build-arg GITHUB_ACCESS_TOKEN=$(GITHUB_ACCESS_TOKEN) \
		--build-arg GOLLUM_APP_USE_BRANCH=$(GOLLUM_APP_USE_BRANCH) \
		-f ./docker/app/Dockerfile \
		--platform linux/amd64 \
		-t gollum-app:linux ./docker/app

push_linux_docker_image: set_env build_linux_docker_image
	@gcloud auth configure-docker
	@docker tag  gollum-app:linux asia.gcr.io/$(PROJECT_ID)/$(PROJECT_NAME)/app:latest
	@docker push asia.gcr.io/$(PROJECT_ID)/$(PROJECT_NAME)/app:latest

set_env:
ifeq ($(env), prd)
	$(eval PROJECT_ID := $(PROJECT_ID_PRD))
else ifeq ($(env), dev)
	$(eval PROJECT_ID := $(PROJECT_ID_DEV))
endif
	@gcloud config set project $(PROJECT_ID)