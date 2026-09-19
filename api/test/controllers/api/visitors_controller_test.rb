require "test_helper"

class Api::VisitorsControllerTest < ActionDispatch::IntegrationTest
  test "GET /api/visitors returns json array" do
    get "/api/visitors"
    assert_response :success
    data = JSON.parse(response.body)
    assert_kind_of Hash, data
    assert_kind_of Array, data["visitors"]
  end

  test "GET /api/visitors returns pagination metadata" do
    get "/api/visitors"
    assert_response :success
    data = JSON.parse(response.body)
    assert data.key?("total")
    assert data.key?("page")
    assert data.key?("per_page")
  end

  test "GET /api/visitors page 1 returns at most 20 records" do
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    assert data["visitors"].length <= 20
  end

  test "GET /api/visitors excludes checked_out visitors" do
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    ids = data["visitors"].map { |v| v["id"] }
    assert_not_includes ids, visitors(:checked_out_visitor).id
  end

  test "GET /api/visitors excludes deactivated visitors" do
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    ids = data["visitors"].map { |v| v["id"] }
    assert_not_includes ids, visitors(:inactive_visitor).id
  end

  test "GET /api/visitors pagination returns different pages" do
    get "/api/visitors?page=1"
    assert_response :success
    page1 = JSON.parse(response.body)["visitors"].map { |v| v["id"] }

    get "/api/visitors?page=2"
    assert_response :success
    page2 = JSON.parse(response.body)["visitors"].map { |v| v["id"] }

    intersection = page1 & page2
    assert_empty intersection
  end

  test "POST /api/visitors creates a visitor" do
    assert_difference "Visitor.count", 1 do
      post "/api/visitors",
        params: { full_name: "Test User", company_name: "Test Co", purpose: "Demo", host_id: hosts(:alice).id },
        as: :json
    end
    assert_response :created
  end

  test "POST /api/visitors sets checked_in_at automatically" do
    post "/api/visitors",
      params: { full_name: "Time Test", company_name: "Time Co", purpose: "Test", host_id: hosts(:alice).id },
      as: :json
    assert_response :created
    data = JSON.parse(response.body)
    assert_not_nil data["checked_in_at"]
  end

  test "POST /api/visitors with empty body rejects creation" do
    assert_no_difference "Visitor.count" do
      post "/api/visitors", params: {}, as: :json
    end
    assert_response :unprocessable_entity
    data = JSON.parse(response.body)
    assert data["errors"].key?("full_name")
  end

  test "POST /api/visitors with missing host_id rejects creation" do
    assert_no_difference "Visitor.count" do
      post "/api/visitors",
        params: { full_name: "Test User", company_name: "Test Co" },
        as: :json
    end
    assert_response :unprocessable_entity
  end

  test "POST /api/visitors with missing company_name rejects creation" do
    assert_no_difference "Visitor.count" do
      post "/api/visitors",
        params: { full_name: "Test User", purpose: "Demo", host_id: hosts(:alice).id },
        as: :json
    end
    assert_response :unprocessable_entity
  end

  test "POST /api/visitors with missing purpose rejects creation" do
    assert_no_difference "Visitor.count" do
      post "/api/visitors",
        params: { full_name: "Test User", company_name: "Test Co", host_id: hosts(:alice).id },
        as: :json
    end
    assert_response :unprocessable_entity
  end

  test "POST /api/visitors returns repeat true for existing active visitor" do
    existing = visitors(:active_visitor)
    post "/api/visitors",
      params: { full_name: existing.full_name, company_name: "Another Co", purpose: "Repeat", host_id: hosts(:benjamin).id },
      as: :json
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal true, data["repeat"]
  end

  test "PATCH /api/visitors/:id/check_out sets checked_out_at" do
    visitor = visitors(:active_visitor)
    patch "/api/visitors/#{visitor.id}/check_out"
    assert_response :success
    visitor.reload
    assert_not_nil visitor.checked_out_at
  end

  test "PATCH /api/visitors/:id/check_out removes from active list" do
    visitor = visitors(:active_visitor)
    patch "/api/visitors/#{visitor.id}/check_out"
    assert_response :success
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    ids = data["visitors"].map { |v| v["id"] }
    assert_not_includes ids, visitor.id
  end

  test "PATCH /api/visitors/:id/deactivate sets active to false" do
    visitor = visitors(:active_visitor)
    patch "/api/visitors/#{visitor.id}/deactivate"
    assert_response :success
    visitor.reload
    assert_equal false, visitor.active
  end

  test "PATCH /api/visitors/:id/deactivate removes from active list" do
    visitor = visitors(:active_visitor)
    patch "/api/visitors/#{visitor.id}/deactivate"
    assert_response :success
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    ids = data["visitors"].map { |v| v["id"] }
    assert_not_includes ids, visitor.id
  end

  test "GET /api/visitors/search returns matching visitors" do
    get "/api/visitors/search?q=Jane"
    assert_response :success
    data = JSON.parse(response.body)
    assert_kind_of Array, data
    assert data.any? { |v| v["full_name"].include?("Jane") }
  end

  test "GET /api/visitors/search excludes deactivated visitors" do
    get "/api/visitors/search?q=Sam"
    assert_response :success
    data = JSON.parse(response.body)
    assert_empty data.select { |v| v["full_name"].include?("Sam Inactive") }
  end

  test "GET /api/visitors/search allows checked_out visitors for repeat visits" do
    get "/api/visitors/search?q=John"
    assert_response :success
    data = JSON.parse(response.body)
    assert data.any? { |v| v["full_name"].include?("John Smith") }
  end

  test "GET /api/visitors check_in_at includes Kathmandu timezone offset" do
    get "/api/visitors?page=1"
    assert_response :success
    data = JSON.parse(response.body)
    visitor_data = data["visitors"].first
    assert_not_nil visitor_data["checked_in_at"]
    assert_match(/\+05:45$/, visitor_data["checked_in_at"])
  end
end
