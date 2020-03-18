
AWS_CLI_PROFILE:=
# default value is empty in order to use the command from bitbucket pipeline
# to activate preset profile use AWS_CLI_PROFILE="--profile test"

define build_app
    npm install
    npm install -g @angular/cli@8.2.1
    ng build --prod --output-path=dist
endef

define deploy_app
	aws s3 sync --exclude '.git/*' --exclude '.gitignore' --exclude 'Makefile' --exclude 'bitbucket-pipelines.yml' --delete dist/ s3://$(1)/ ${AWS_CLI_PROFILE}
	aws cloudfront create-invalidation --distribution-id $(2) --paths "/*" ${AWS_CLI_PROFILE}
endef

build-app-dev:
	$(call build_app,develop)

build-app-prod:
	$(call build_app,production)

deploy-app-dev:
	$(call deploy_app,dev-app.accuflip.com,E1TRW5JKLK548V)

deploy-app-prod:
	$(call deploy_app,app.accuflip.com,ERKH4N7XHBLC3)


BITBUCKET_BRANCH:=develop
AWS_BUCKET:=dev-app.accuflip.com
# this is the default value
# for stage use: make slack-notification-success BITBUCKET_BRANCH=stage AWS_BUCKET=stage-app.kuailiandp.net
# for prod use: make slack-notification-success BITBUCKET_BRANCH=master AWS_BUCKET=app.kuailiandp.com

slack-notification-success:
	curl -s -X POST https://hooks.slack.com/services/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 \
	-H "content-type:application/json" \
    -d '{"text":"[frontend] Branch ${BITBUCKET_BRANCH} was SUCCESSFULLY deployed to ${AWS_BUCKET} bucket."}'

slack-notification-fail:
	curl -s -X POST https://hooks.slack.com/services/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 \
    -H "content-type:application/json" \
    -d '{"text":"[frontend] Deploy of branch ${BITBUCKET_BRANCH} to ${AWS_BUCKET} bucket FAILED."}'
