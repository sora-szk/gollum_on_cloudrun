ENV_FILE := ../.env
include $(ENV_FILE)
export $(shell sed 's/=.*//' $(ENV_FILE))

env_value_check: set_env
	@echo REGION=$(REGION)
	@echo PROJECT_ID_PRD=$(PROJECT_ID_PRD)
	@echo SERVICE_ACCOUNT_NAME_PRD=$(SERVICE_ACCOUNT_NAME_PRD)
	@echo SERVICE_ACCOUNT_FILE_NAME_PRD=$(SERVICE_ACCOUNT_FILE_NAME_PRD)

	@echo PROJECT_ID_DEV=$(PROJECT_ID_DEV)
	@echo SERVICE_ACCOUNT_NAME_DEV=$(SERVICE_ACCOUNT_NAME_DEV)
	@echo SERVICE_ACCOUNT_FILE_NAME_DEV=$(SERVICE_ACCOUNT_FILE_NAME_DEV)

	@echo PROJECT_ID=$(PROJECT_ID)
	@echo SERVICE_ACCOUNT_NAME=$(SERVICE_ACCOUNT_NAME)
	@echo SERVICE_ACCOUNT_FILE_NAME=$(SERVICE_ACCOUNT_FILE_NAME)

setup:
	@npm i -g cdktf-cli
	@yarn install
	@cdktf init --template="typescript" --local
	@cdktf get

plan: set_env
	@export REGION=$(REGION) && \
	 export NODE_ENV=$(NODE_ENV) && \
	 export PROJECT_ID=$(PROJECT_ID) && \
	 export SERVICE_ACCOUNT_NAME=$(SERVICE_ACCOUNT_NAME) && \
	 export SERVICE_ACCOUNT_FILE_NAME=$(SERVICE_ACCOUNT_FILE_NAME) && \
	 cdktf plan

synth: set_env
	@export REGION=$(REGION) && \
	 export NODE_ENV=$(NODE_ENV) && \
	 export PROJECT_ID=$(PROJECT_ID) && \
	 export SERVICE_ACCOUNT_NAME=$(SERVICE_ACCOUNT_NAME) && \
	 export SERVICE_ACCOUNT_FILE_NAME=$(SERVICE_ACCOUNT_FILE_NAME) && \
	 cdktf synth

deploy: set_env
	@export REGION=$(REGION) && \
	 export NODE_ENV=$(NODE_ENV) && \
	 export PROJECT_ID=$(PROJECT_ID) && \
	 export SERVICE_ACCOUNT_NAME=$(SERVICE_ACCOUNT_NAME) && \
	 export SERVICE_ACCOUNT_FILE_NAME=$(SERVICE_ACCOUNT_FILE_NAME) && \
	 cdktf deploy

set_env:
ifeq ($(env), prd)
	$(eval NODE_ENV := prd)
	$(eval PROJECT_ID := $(PROJECT_ID_PRD))
	$(eval SERVICE_ACCOUNT_NAME := $(SERVICE_ACCOUNT_NAME_PRD))
	$(eval SERVICE_ACCOUNT_FILE_NAME := $(SERVICE_ACCOUNT_FILE_NAME_PRD))
else ifeq ($(env), dev)
	$(eval NODE_ENV := dev)
	$(eval PROJECT_ID := $(PROJECT_ID_DEV))
	$(eval SERVICE_ACCOUNT_NAME := $(SERVICE_ACCOUNT_NAME_DEV))
	$(eval SERVICE_ACCOUNT_FILE_NAME := $(SERVICE_ACCOUNT_FILE_NAME_DEV))
endif
	@gcloud config set project $(PROJECT_ID)