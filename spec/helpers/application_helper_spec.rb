require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe '#title' do
    it 'sets the page title content' do
      helper.title('Test Page')
      expect(helper.content_for(:title)).to eq('Test Page')
    end

    it 'returns nil' do
      result = helper.title('Test Page')
      expect(result).to be_nil
    end

    it 'accepts different page titles' do
      helper.title('Home Page')
      expect(helper.content_for(:title)).to include('Home Page')
    end
  end

  describe '#markdown' do
    it 'converts markdown to HTML' do
      result = helper.markdown('# Heading')
      expect(result).to include('<h1>Heading</h1>')
    end

    it 'returns an HTML-safe string' do
      result = helper.markdown('**bold**')
      expect(result).to be_html_safe
    end

    it 'converts bold text' do
      result = helper.markdown('**bold text**')
      expect(result).to include('<strong>bold text</strong>')
    end

    it 'converts italic text' do
      result = helper.markdown('*italic text*')
      expect(result).to include('<em>italic text</em>')
    end

    it 'converts links' do
      result = helper.markdown('[Link](http://example.com)')
      expect(result).to include('<a')
      expect(result).to include('href="http://example.com"')
    end

    it 'adds nofollow to links' do
      result = helper.markdown('[Link](http://example.com)')
      expect(result).to include('rel="nofollow"')
    end

    it 'adds target blank to links' do
      result = helper.markdown('[Link](http://example.com)')
      expect(result).to include('target="_blank"')
    end

    it 'converts autolinks' do
      result = helper.markdown('http://example.com')
      expect(result).to include('<a href="http://example.com"')
    end

    it 'converts tables' do
      markdown_table = <<~MD
        | Header 1 | Header 2 |
        |----------|----------|
        | Cell 1   | Cell 2   |
      MD

      result = helper.markdown(markdown_table)
      expect(result).to include('<table>')
      expect(result).to include('<th>Header 1</th>')
      expect(result).to include('<td>Cell 1</td>')
    end

    it 'converts fenced code blocks' do
      result = helper.markdown("```\ncode here\n```")
      expect(result).to include('<code>')
    end

    it 'handles hard wraps' do
      result = helper.markdown("Line 1\nLine 2")
      expect(result).to include('<br>')
    end

    it 'filters HTML for security' do
      result = helper.markdown('<script>alert("xss")</script>')
      expect(result).not_to include('<script>')
    end

    it 'handles empty text' do
      result = helper.markdown('')
      expect(result).to be_html_safe
      expect(result).to be_a(String)
    end

    it 'raises error for nil text' do
      expect { helper.markdown(nil) }.to raise_error(TypeError)
    end
  end
end
