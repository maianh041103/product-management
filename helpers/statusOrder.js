module.exports.statusOrder = (time) => {
  var ngayBatDau = new Date(time); // Chuyển đổi chuỗi thời gian thành đối tượng Date
  var ngayKetThuc = new Date(new Date()); // Chuyển đổi chuỗi thời gian thành đối tượng Date
  var khoangCach = Math.abs(ngayKetThuc - ngayBatDau) / 3600000 / 24; // Chuyển đổi thành giờ
  return khoangCach;
}

