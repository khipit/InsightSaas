// Simple test to verify the new category and tag management functionality
// This demonstrates the basic usage of the new services

import { categoryService } from './lib/category-service'
import { tagService } from './lib/tag-service'
import { newsService } from './lib/news-service'

// Mock API calls for testing
async function testCategoryAndTagManagement() {
  console.log('Testing Category and Tag Management System...')
  
  try {
    // Test category creation
    console.log('1. Testing category creation...')
    const newCategory = await categoryService.createCategory({
      name: '기술',
      description: '기술 관련 뉴스',
      color: '#10B981'
    })
    console.log('✓ Category created:', newCategory)
    
    // Test tag creation
    console.log('2. Testing tag creation...')
    const newTag = await tagService.createTag({
      name: '긴급',
      color: '#EF4444'
    })
    console.log('✓ Tag created:', newTag)
    
    // Test news search with filters
    console.log('3. Testing enhanced news search...')
    const searchResults = await newsService.searchNews({
      query: '삼성',
      categoryId: newCategory.id,
      tagIds: [newTag.id],
      limit: 10
    })
    console.log('✓ Search results:', searchResults)
    
    // Test news article creation with category and tags
    console.log('4. Testing news article creation...')
    const newArticle = await newsService.createNewsArticle({
      title: '삼성전자 신기술 발표',
      summary: '삼성전자가 새로운 기술을 발표했습니다.',
      url: 'https://example.com/samsung-tech',
      source: '테크뉴스',
      sentiment: 'positive',
      categoryId: newCategory.id,
      tagIds: [newTag.id]
    })
    console.log('✓ News article created:', newArticle)
    
    console.log('\n✅ All tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.log('\n📝 Note: This is expected if the backend API is not running.')
    console.log('The implementation includes fallback mock data for demonstration.')
  }
}

// Test data structures
const sampleCategory = {
  id: 'cat_001',
  name: '경제',
  description: '경제 관련 뉴스',
  color: '#3B82F6',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const sampleTag = {
  id: 'tag_001',
  name: '속보',
  color: '#F59E0B',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const sampleNewsArticle = {
  id: 'news_001',
  title: 'LG전자 AI 기술 혁신',
  summary: 'LG전자가 차세대 AI 기술을 공개했습니다.',
  url: 'https://example.com/lg-ai-tech',
  publishedAt: '2024-01-01T12:00:00Z',
  source: 'AI 뉴스',
  sentiment: 'positive' as const,
  categoryId: 'cat_001',
  category: sampleCategory,
  tagIds: ['tag_001'],
  tags: [sampleTag]
}

console.log('📋 Sample data structures:')
console.log('Category:', sampleCategory)
console.log('Tag:', sampleTag)
console.log('Enhanced News Article:', sampleNewsArticle)

// Export for potential use in other files
export {
  testCategoryAndTagManagement,
  sampleCategory,
  sampleTag,
  sampleNewsArticle
}