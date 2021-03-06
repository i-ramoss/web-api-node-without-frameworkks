const http = require("http")
const HeroFactory = require("./factories/heroFactories")
const Hero = require("./entities/hero")

const PORT = 3000
const DEFAULT_HEADER = { "Content-Type": "application/json" }

const heroService = HeroFactory.generateInstance()

const routes = {
  "/heroes:get": async (request, response) => {
    const { id } = request.queryString
    const heroes = await heroService.find(id)

    response.write(JSON.stringify({ results: heroes }))

    return response.end()
  },

  "/heroes:post": async (request, response) => {
    // async iterators
    for await (const data of request) {
      try {
        // await Promise.reject("/heroes:get")

        const item = JSON.parse(data)
        const hero = new Hero(item)
        const { error, valid } = hero.isValid()

        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER)
          response.write(JSON.stringify({ error: error.join(',') }))

          return response.end()
        }

        const id = await heroService.create(hero)
        
        response.writeHead(201, DEFAULT_HEADER)
        response.write(JSON.stringify({ success: "User created with success!!", id }))

        return response.end()
      } 
      catch (error) {
        return handleError(response)(error)
      }
    }
  },

  default: (request, response) => {
    response.write("Hello!")
    response.end()
  }
}

const handleError = response => {
  return error => {
    console.error("Something went wrong", error)

    response.writeHead(500, DEFAULT_HEADER)
    response.write(JSON.stringify({ error: "Internal server error" }))

    return response.end()
  }
}

const handler = (request, response) => {
  const { url, method  } = request
  const [ path, route, id ] = url.split("/")

  request.queryString = { id: isNaN(id) ? id : Number(id) }

  const key = `/${route}:${method.toLowerCase()}`

  response.writeHead(200, DEFAULT_HEADER)

  const chosen = routes[key] || routes.default

  return chosen(request, response).catch(handleError(response))
}

http.createServer(handler).listen(PORT, () => console.log("server is running at", PORT))