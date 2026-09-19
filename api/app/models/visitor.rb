class Visitor < ApplicationRecord
  belongs_to :host, optional: true

  validates :full_name, presence: true
  validates :company_name, presence: true
  validates :purpose, presence: true
  validates :host_id, presence: true

  before_create :set_checked_in_at

  private

  def set_checked_in_at
    self.checked_in_at = Time.current
  end
end
