const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const DOCS_DIRECTORY = path.join(process.cwd(), 'contents/docs')
const OUTPUT_FILE = path.join(process.cwd(), 'public/search-index.json')

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else if (file.endsWith('.mdx')) {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

function normalizeUrl(url) {
  // Remove /index from the end of the URL
  return url.replace(/\/index$/, '')
}

function generateSearchIndex() {
  const searchIndex = []
  const mdxFiles = getAllFiles(DOCS_DIRECTORY)

  mdxFiles.forEach(filePath => {
    const relativePath = filePath.replace(DOCS_DIRECTORY, '').replace(/\.mdx$/, '')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Get category from the directory structure
    const category = relativePath.split(path.sep)[1]

    // Create the URL path and normalize it
    const urlPath = normalizeUrl(`/docs${relativePath}`)

    // Add to search index
    searchIndex.push({
      title: data.title || path.basename(filePath, '.mdx'),
      content: content.slice(0, 1000), // Limit content length
      url: urlPath,
      category: category
    })

    // Extract and index headings from the content
    const headings = content.match(/#{2,6}\s+.+/g) || []
    headings.forEach(heading => {
      const title = heading.replace(/#{2,6}\s+/, '')
      const id = title.toLowerCase().replace(/[^\w]+/g, '-')
      
      searchIndex.push({
        title: title,
        content: '', // No content for headings
        url: `${urlPath}#${id}`,
        category: category
      })
    })
  })

  // Write the search index to a JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2))
  console.log(`Search index built with ${searchIndex.length} entries`)
}

generateSearchIndex() 