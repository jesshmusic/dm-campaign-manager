json.count @backgrounds.length
json.results @backgrounds, partial: 'admin/v1/backgrounds/background', as: :background
