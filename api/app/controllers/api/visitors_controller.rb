module Api
  class VisitorsController < ApplicationController
    PER_PAGE = 20

    def index
      page = (params[:page] || 1).to_i
      base = Visitor.where(checked_out_at: nil, active: true)
      visitors = base.order(:id)
                      .offset((page - 1) * PER_PAGE)
                      .limit(PER_PAGE)

      repeat_names = base.where(full_name: visitors.pluck(:full_name))
                          .group(:full_name)
                          .having("count(*) > 1")
                          .pluck(:full_name)
                          .to_set

      total = base.count

      render json: {
        visitors: visitors.map { |v| serialize(v, repeat_names: repeat_names) },
        total: total,
        page: page,
        per_page: PER_PAGE
      }
    end

    def create
      visitor = Visitor.new(visitor_params)
      if visitor.save
        repeat_names = Visitor.where(full_name: visitor.full_name)
                              .where(active: true, checked_out_at: nil)
                              .where.not(id: visitor.id)
                              .exists?
        render json: serialize(visitor, repeat: repeat_names), status: :created
      else
        render json: { errors: visitor.errors }, status: :unprocessable_entity
      end
    end

    def check_out
      visitor = Visitor.find(params[:id])
      visitor.update!(checked_out_at: Time.current)
      render json: serialize(visitor)
    end

    def deactivate
      visitor = Visitor.find(params[:id])
      visitor.update!(active: false)
      render json: { success: true }
    end

    def search
      q = params[:q].to_s.strip
      visitors = Visitor.where("full_name LIKE ?", "%#{q}%")
                        .where(active: true)
                        .order(:full_name)
                        .limit(10)
      render json: visitors.map { |v| { id: v.id, full_name: v.full_name, company_name: v.company_name, host_id: v.host_id } }
    end

    private

    def visitor_params
      params.permit(:full_name, :company_name, :purpose, :host_id)
    end

    def serialize(visitor, repeat_names: Set.new, repeat: false)
      is_repeat = repeat || repeat_names.include?(visitor.full_name)
      {
        id: visitor.id,
        full_name: visitor.full_name,
        company_name: visitor.company_name,
        purpose: visitor.purpose,
        checked_in_at: visitor.checked_in_at&.iso8601,
        checked_out_at: visitor.checked_out_at&.iso8601,
        active: visitor.active,
        repeat: is_repeat,
        host_id: visitor.host_id,
        host_name: visitor.host&.name
      }
    end
  end
end
