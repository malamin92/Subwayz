# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150410015118) do

  create_table "calendars", id: false, force: :cascade do |t|
    t.string "service_id", limit: 30, null: false
    t.string "monday",     limit: 4
    t.string "tuesday",    limit: 4
    t.string "wednesday",  limit: 4
    t.string "thursday",   limit: 4
    t.string "friday",     limit: 4
    t.string "saturday",   limit: 4
    t.string "sunday",     limit: 4
    t.string "start_date", limit: 30
    t.string "end_date",   limit: 30
  end

  add_index "calendars", ["service_id"], name: "index_calendars_on_service_id", unique: true, using: :btree

  create_table "routes", id: false, force: :cascade do |t|
    t.string "route_id",         limit: 20,  null: false
    t.string "agency_id",        limit: 20
    t.string "route_short_name", limit: 100
    t.string "route_long_name",  limit: 100
    t.string "route_type",       limit: 100
    t.string "route_color",      limit: 100
    t.string "route_text_color", limit: 50
  end

  add_index "routes", ["route_id"], name: "index_routes_on_route_id", unique: true, using: :btree

  create_table "shapes", id: false, force: :cascade do |t|
    t.string "shape_id",            limit: 40
    t.string "shape_pt_lat",        limit: 40
    t.string "shape_pt_lon",        limit: 40
    t.string "shape_pt_sequence",   limit: 40
    t.string "shape_dist_traveled", limit: 40
  end

  create_table "stop_times", force: :cascade do |t|
    t.string "trip_id",             limit: 40, null: false
    t.string "arrival_time",        limit: 40
    t.string "departure_time",      limit: 40
    t.string "stop_id",             limit: 20, null: false
    t.string "stop_sequence",       limit: 20
    t.string "pickup_type",         limit: 40
    t.string "drop_off_type",       limit: 40
    t.string "shape_dist_traveled", limit: 20
  end

  add_index "stop_times", ["stop_id"], name: "stop_id", using: :btree
  add_index "stop_times", ["trip_id"], name: "trip_id", using: :btree

  create_table "stops", id: false, force: :cascade do |t|
    t.string "stop_id",        limit: 20,  null: false
    t.string "stop_code",      limit: 20
    t.string "stop_name",      limit: 100
    t.string "stop_lat",       limit: 200
    t.string "stop_lon",       limit: 200
    t.string "zone_id",        limit: 200
    t.string "location_type",  limit: 10
    t.string "parent_station", limit: 10
  end

  add_index "stops", ["stop_id"], name: "index_stops_on_stop_id", unique: true, using: :btree

  create_table "trips", id: false, force: :cascade do |t|
    t.string "trip_id",       limit: 40, null: false
    t.string "route_id",      limit: 20, null: false
    t.string "service_id",    limit: 30, null: false
    t.string "trip_headsign", limit: 40
    t.string "direction_id",  limit: 40
    t.string "block_id",      limit: 40
    t.string "shape_id",      limit: 40
  end

  add_index "trips", ["route_id"], name: "route_id", using: :btree
  add_index "trips", ["service_id"], name: "service_id", using: :btree
  add_index "trips", ["trip_id"], name: "index_trips_on_trip_id", unique: true, using: :btree

  create_table "votes", force: :cascade do |t|
    t.integer "monday_d",     limit: 4
    t.integer "monday_nd",    limit: 4
    t.integer "tuesday_d",    limit: 4
    t.integer "tuesday_nd",   limit: 4
    t.integer "wednesday_d",  limit: 4
    t.integer "wednesday_nd", limit: 4
    t.integer "thursday_d",   limit: 4
    t.integer "thursday_nd",  limit: 4
    t.integer "friday_d",     limit: 4
    t.integer "friday_nd",    limit: 4
    t.integer "saturday_d",   limit: 4
    t.integer "saturday_nd",  limit: 4
    t.integer "sunday_d",     limit: 4
    t.integer "sunday_nd",    limit: 4
  end

end
