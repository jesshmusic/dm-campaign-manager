# The setup guide's rows are inserted by their migration, so a test database
# made with db:migrate has them and one loaded from schema.rb doesn't. These
# start every example that uses them from the same place.
module SetupGuideHelpers
  # Removes the guide's steps and templates (rolled back after the example)
  def clear_setup_guide
    SetupGuideStep.delete_all
    SetupGuideTemplate.delete_all
  end

  # Every step and template, in order, with factory words
  def seed_setup_guide
    clear_setup_guide
    SetupGuideStep::KEYS.each { |key| create(:setup_guide_step, key: key) }
    SetupGuideTemplate::KEYS.each { |key| create(:setup_guide_template, key: key) }
  end
end

RSpec.configure do |config|
  config.include SetupGuideHelpers
end
