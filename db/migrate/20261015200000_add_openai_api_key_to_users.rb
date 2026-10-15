class AddOpenAIApiKeyToUsers < ActiveRecord::Migration[7.1]
  def change
    # Encrypted with Active Record encryption (see User), so text for the ciphertext
    add_column :users, :openai_api_key, :text
  end
end
