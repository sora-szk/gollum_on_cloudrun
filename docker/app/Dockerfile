FROM gollumwiki/gollum:v5.3.2

WORKDIR /

ARG GITHUB_REPO_URL
ARG GITHUB_ACCESS_TOKEN
ARG GOLLUM_APP_USE_BRANCH

ENV GITHUB_REPO_URL=$GITHUB_REPO_URL
ENV GITHUB_ACCESS_TOKEN=$GITHUB_ACCESS_TOKEN
ENV GOLLUM_APP_USE_BRANCH=$GOLLUM_APP_USE_BRANCH

COPY ./config.rb /
COPY ./shell /shell
COPY ./custom_templates /custom_templates
RUN chmod a+x /shell/entry_point.sh /shell/git_sync.sh

ENTRYPOINT [ "/shell/entry_point.sh" ]
