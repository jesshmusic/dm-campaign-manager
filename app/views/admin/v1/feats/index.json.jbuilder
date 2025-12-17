json.count @feats.length
json.results @feats, partial: 'admin/v1/feats/feat', as: :feat
