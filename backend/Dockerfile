FROM golang:tip-alpine3.22 AS build

WORKDIR /app

COPY . .

RUN go build -o /bin/app ./main.go


FROM build

EXPOSE 3000

COPY --from=build ./app .

CMD [ "/bin/app" ]