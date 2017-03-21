class InquiriesController < ApplicationController
  before_action :set_inquiry, only: [:show, :update, :destroy]
  wrap_parameters :inquiry, include: ["name", "contents"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  # GET /inquiries
  # GET /inquiries.json
  def index
    authorize Inquiry
    inquiries = policy_scope(Inquiry.all)
    @inquiries = InquiryPolicy.merge(inquiries)
  end

  # GET /inquiries/1
  # GET /inquiries/1.json
  def show
    authorize @inquiry
    inquiries = policy_scope(Inquiry.where(:id=>@inquiry.id))
    @inquiry = InquiryPolicy.merge(inquiries).first
  end

  # POST /inquiries
  # POST /inquiries.json
  def create
    authorize Inquiry
    @inquiry = Inquiry.new(inquiry_params)
    binding.pry
    if @inquiry.save
      render json: @inquiry, status: :created, location: @inquiry
    else
      render json: @inquiry.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /inquiries/1
  # PATCH/PUT /inquiries/1.json
  def update
    authorize @inquiry

    if @inquiry.update(inquiry_params)
      head :no_content
    else
      render json: {errors:@inquiry.errors.messages}, status: :unprocessable_entity
    end
  end

  # DELETE /inquiries/1
  # DELETE /inquiries/1.json
  def destroy
    authorize @inquiry
    @inquiry.destroy

    head :no_content
  end

  private

    def set_inquiry
      @inquiry = Inquiry.find(params[:id])
    end

    def inquiry_params
      params.require(:inquiry).permit(:name, :contents)
    end
end
