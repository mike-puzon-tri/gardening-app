FROM python:3.11

# Needed for pipeline
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Install general dependencies
RUN apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y \
        # Common utilities
        git \
        nodejs \
        npm \
        libpcre2-8-0 \
        make \
        # Builder deps
        unzip \
        software-properties-common \
        # stupid pipeline fix
        sudo \
        curl \
        vim \
        # For jenkins extensions
        default-jre \
        # attempt to fix lc bug
        locales && \
    locale-gen en_US.UTF-8 && \
    # Upgrade pip for be able get latest Checkov
    python3 -m pip install --upgrade pip && \
    # Cleanup
    rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install tox
RUN python3 -m pip install tox-uv

# For pnpm
RUN npm install -g pnpm corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Jenkins lib wants to run as sudo
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install openapi generator
RUN npm install @openapitools/openapi-generator-cli -g
RUN openapi-generator-cli version-manager set 6.6.0

ENV PATH="/home/$USERNAME/.local/bin:$PATH"
