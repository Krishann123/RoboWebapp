import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function DialogDemo() {
  const [newsCard, setNewsCard] = useState({
    title: "",
    date: "",
    description: "",
    image: "",
    alt: "",
    link: "",
    category: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setNewsCard((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submit logic here (e.g., send newsCard to backend or update state)
    try {
      const response = await fetch("/api/update-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsCard),
      })
      if (!response.ok) {
        throw new Error("Failed to update news")
      }
      // Optionally reset form or show success message
      console.log("News updated successfully")
    } catch (error) {
      console.error(error)
      // Optionally show error message to user
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-5">Add News</Button>
      </DialogTrigger>
      <DialogContent className=" mwsm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Add News Card</DialogTitle>
            <DialogDescription className="text-center">
              Enter the details for the news card below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                name="category"
                value={newsCard.category}
                onChange={handleChange}
                className="col-span-3 border rounded px-2 py-1"
                required
              >
                <option value="" disabled>Select category</option>
                <option value="latest-news">latest-news</option>
                <option value="latest-news">latest-events</option>
                <option value="latest-news">latest-webinar</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newsCard.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                value={newsCard.date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={newsCard.description}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={newsCard.image}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alt" className="text-right">
                Alt Text
              </Label>
              <Input
                id="alt"
                name="alt"
                value={newsCard.alt}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                name="link"
                value={newsCard.link}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="submit">Save News Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
