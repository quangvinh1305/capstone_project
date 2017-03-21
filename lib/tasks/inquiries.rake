namespace :ptourist do

  desc "create inquiries for members"
  task create_inquiries: :environment do
    5.times do
      m = member_users.map do |member|
        unless (member.id == mike_user.id)
          inquiry = {:name => Faker::Lorem.sentence, :contents => Faker::Lorem.paragraph}
          inq = Inquiry.create! inquiry
          member.add_role(Role::ORGANIZER, inq).save
          member
          puts "added members for #{inq.name}: #{member}"
        end
      end.select { |m|  m}
    end
  end
end
