# Callbreak Tournament Starter Code

Starter codes for callbreak tournament

## Contents

`node_docker/` contains starter code for bot along with some instructions on building docker file

`python_docker/` contains starter code for bot that utilizes `sanic` library along with some instructions.

> `sanic` has been selected because it is considerably faster than `flask` but the downside is that the image size is now considerably bigger `60 MB -> 275 MB` but runs `~9x` faster on basic requests.

## Running instructions

### Python

> You will need to have python3 and pip3 installed to run this.

1. Navigate into python_docker first with `cd python_docker/`
1. Then, install requirements with `pip install -r requirements.txt`
1. Run with `python src/app.py`

### JavaScript (Node)

> You will need to have node >= 14 to run this.

1. Navigate into node_docker first with `cd node_docker/`
1. Run with `node src/index.js`

# Building Instructions

You can build the existing projects by running `docker build . -t <tag>` inside `node_docker/` or `python_docker/`.

> `.` denotes that it will try to build the current directory

This builds you a docker image with the specified `<tag>` which you can view by running `docker images`.

> You can use any name for `<tag>`. We reference the images using their id so, even if you submit your image with same tag name/ file name, it should not matter.

To run a built container run:

```
docker run --name <container name> -p 7000:7000 -m=2048m --cpus=1 -it <tag or image id>
```

This runs the image with `<tag or image id>` and binds local port `7000` with contianer port `7000`, limits memory to `2040 MB RAM` and `1 CPU`. We run your docker image similarly on our server.

> You should test your image by running it in the sandbox prior to uploading it.

After running your image, you create a container. The container reserves the name that you have provided it.

- To remove a container, run `docker rm <container id or name>`.
- To list all active containers, run `dokcer ps`.
- To list all containers, including inactive ones, run `docker ps -a`.

To export your docker image for submission, run `docker save <tag> | gzip > <tag>.tar.gz`.

> Always save the docker file as .gz to reduce upload time.

To delete your existing docker image run `docker image remove <image id>`. You can get image id by running `docker images`
