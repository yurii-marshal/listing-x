
AWS_CLI_PROFILE:=
# default value is empty in order to use the command from bitbucket pipeline
# to activate preset profile use AWS_CLI_PROFILE="--profile test"

define build_app
  npm install
  npm run build:$(1)
endef

define deploy_app
	aws s3 sync --exclude '.git/*' --exclude '.gitignore' --exclude 'Makefile' --exclude 'bitbucket-pipelines.yml' --delete dist/ s3://$(1)/ ${AWS_CLI_PROFILE}
	aws cloudfront create-invalidation --distribution-id $(2) --paths "/*" ${AWS_CLI_PROFILE}
endef

build-app-dev:
	$(call build_app,develop)

build-app-stage:
	$(call build_app,staging)

build-app-prod:
	$(call build_app,production)

deploy-app-dev:
	$(call deploy_app,dev-app.accuflip.com,E1TRW5JKLK548V)

deploy-app-stage:
	$(call deploy_app,stage-app.accuflip.com,E3P1MNUGP44UH4)

deploy-app-prod:
	$(call deploy_app,app.accuflip.com,ERKH4N7XHBLC3)

