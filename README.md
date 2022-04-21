# callbreak-tournament-starter-code

Starter codes for callbreak tournament

# Building Instructions

You can build the existing projects by running `docker build -t <tag> .` inside `node_docker/` or `python_docker/`.

This builds you a docker image with the specified `<tag>` which you can view by running `docker images`.

> You can use any name for `<tag>`. We reference the images using their id so, even if you submit your image with same tag name/ file name, it should not matter.

To run a built container run:

```
docker run --name <container name> -p 7000:7000 -m=2048m --cpus=1 -d <tag or image id>
```

This runs the image with `<tag or image id>` and binds local port `7000` with contianer port `7000`, limits memory to `2040 MB RAM` and `1 CPU`. This is how we run your docker image on our server.

> You should test your image by running it in the sandbox prior to uploading it.

To export your docker image for submission, run `docker save <tag> | gzip > <tag>.tar.gz`.

> Always save the docker file as .gz to reduce upload time.

To delete your existing docker image run `docker image remove <image id>`. You can get image id by running `docker images`

## Contents

`node_docker/` contains starter code for bot along with some instructions on building docker file

`python_docker/` contains starter code for bot that utilizes `sanic` library along with some instructions.

> `sanic` has been selected because it is considerably faster than `flask` but the downside is that the image size is now considerably bigger `60 MB -> 275 MB` but runs `~9x` faster on basic requests.
