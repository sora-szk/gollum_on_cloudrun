require 'gollum/app'

class CustomGollum < Precious::App
  before do
    @name = "Custom Gollum Wiki"
    puts "use branch: #{ENV['GOLLUM_APP_USE_BRANCH'] || 'main'}"
  end
end

Precious::App.set(:gollum_path, '/wikiRepository')
Precious::App.set(:default_markup, :markdown)
wiki_options = {
  ref: ENV['GOLLUM_APP_USE_BRANCH'] || 'main',
  universal_toc: false,
  :template_dir => '/custom_templates'
}
Precious::App.set(:wiki_options, wiki_options)
