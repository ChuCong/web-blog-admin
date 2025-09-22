export default {
  validate: {
    email: "Email chưa đúng định dạng, vui lòng nhập lại!",
    min: "Vui lòng nhập tối thiểu {number} ký tự!",
    max: "Vui lòng nhập tối đa {number} ký tự!",
    max2: "Số điện thoại phải {min}<=SĐT<={max}",
    required: "Vui lòng điền {filed}!",
    numeric: "Vui lòng nhập số!",
    number: "{filed} không được chứa ký tự đặc biệt. Vui lòng chỉ nhập số!",
    file_or_link: "Bạn chưa upload file hoặc gắn link!",
    date: "Ngày và giờ hiển thị không được chọn ngày quá khứ!",
    date_compare: "Ngày kết thúc phải sau ngày bắt đầu!",
    required_class_room: "Vui lòng chọn lớp để copy!",
    confirmed: "Xác nhận mật khẩu không khớp!",
    size: "{filed} tải lên có dung lượng <= {number}",
    phone_is_valid: "Số điện thoại không hợp lệ",
    unique: "{field} đã tồn tại",
    image: "Upload ảnh không đúng định dạng",
    reason_trim: "Vui lòng không nhập khoảng trắng 2 đầu dòng.",
    mark: "Điểm số không hợp lệ",
    type_file: "File tải lên phải có định dạng file excel",
    max_address: "Địa chỉ không vượt quá 255 ký tự",
    password_old_not_same: "Mật khẩu mới không được trùng mật khẩu cũ",
    invalid_format: "{field} không hợp lệ!",
    name: "Tên",
    name_road: "Tên lộ trình",
    send_time_road: "Thời gian gửi",
    exams_road: "Danh sách đề thi",
  },
  category: {
    name: "Tên chuyên mục",
    slug: "Slug",
  },
  admin: {
    title: 'Quản lý Admin',
    email: "Email ",
    password: "Mật khẩu ",
    user_name: "Tên tài khoản ",
    roles: "Vai trò ",
    company_id: "Đơn vị ",
  },
  company: {
    name: "Tên đơn vị ",
  },

  hello: "XIn Chao",
  action: "THAO TÁC",
  menu: {
    home: 'Dashboard',
    category: "Quản lý Chuyên mục",
    article: "Quản lý bài viết",
    tag: "Quản lý Tag",
    resource: "Quản lý Tài nguyên",
    comment: "Quản lý Bình luận",
    faq: "Quản lý FAQ",
    contact: "Quản lý liên hệ Msd",
    certificate: {
      title: "Quản lý Chứng chỉ",
      child: {
        certificate_template: "Template chứng chỉ",
        course_certificate: "Gán chứng chỉ cho khóa học"
      }
    },
    notification: {
      title: "Quản lý Thông báo",
      child: {
        notification: "Thông báo",
        user_notification: "Thông báo đã gửi"
      }
    },
    new: "Quản lý Tin tức",
    student: "Quản lý Học viên",
    teacher: "Quản lý Giảng viên",
    log: "Lịch sử truy cập",
    setting: {
      title: "Cấu hình",
      child: {
        storage: "Lưu trữ",
        watermark: "Watermark",
        video: "Video",
        banner: "Banner",
        about_msd: "Về MSD",
        testimonial: "Testimonial",
        learning_statistics: 'Thống kê học tập',
        other: 'Cấu hình khác',
        category: "Ảnh banner khóa học"
      }
    },
    roles: "Quản lý vai trò"
  },
  logout: "Đăng xuất",
  login: {
    description:
      "MSD Việt Nam",
    title: "Đăng nhập",
    email: "Nhập email",
    password: "Nhập mật khẩu",
  },
  not_result: 'Không có kết quả tìm kiếm',
  type_road: {
    daily: 'Hằng ngày',
    days_of_week: 'Ngày trong tuần',
    specific_dates: 'Chọn ngày'
  },
  days_of_week: {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ Nhật',
  }
}
