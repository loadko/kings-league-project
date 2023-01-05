import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STATICS_PATH = path.join(process.cwd(), 'assets', 'static')
const DB_PATH = path.join(process.cwd(), 'db')

const DB_RAW_PRESIDENTS_PATH = path.join(DB_PATH, 'raw-presidents.json')
const DB_PRESIDENTS_PATH = path.join(DB_PATH, 'presidents.json')
const STATIC_PRESIDENTS_PATH = path.join(STATICS_PATH, 'presidents')

const RAW_PRESIDENTS = await readFile(DB_RAW_PRESIDENTS_PATH, 'utf-8').then(JSON.parse)

const promises = RAW_PRESIDENTS.map(async (presidentInfo) => {
  const { slug: id, title, _links: links } = presidentInfo
  const { rendered: name } = title
  const { 'wp:attachment': attachment } = links
  const { href: imageApiUrl } = attachment[0]

  console.log(`> Fetching attachment for president: ${name}`)
  const responseImageApi = await fetch(imageApiUrl)
  const data = await responseImageApi.json()
  const { guid } = data[0]
  const { rendered: imageUrl } = guid

  const fileExtension = imageUrl.split('.').at(-1)

  console.log(`> Fetching image for president: ${name}`)
  const responseImage = await fetch(imageUrl)
  const arrayBuffer = await responseImage.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileName = `${id.toLowerCase()}.${fileExtension}`
  const filePath = path.join(STATIC_PRESIDENTS_PATH, fileName)

  console.log(`> Writing image to disk for president: ${name}`)
  await writeFile(filePath, buffer, 'utf-8')

  console.log(`> President: ${name} done!`)
  return { id, name, image: fileName, teamId: '' }
})

await Promise.all(promises).then(async (presidents) => {
  await writeFile(DB_PRESIDENTS_PATH, JSON.stringify(presidents, null, 2), 'utf-8')
})
