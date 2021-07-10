import { handler } from "../../services/space-table/Create"

const event = {
  body: {
    location: "Paris",
  },
}

handler(event as any, {} as any)
