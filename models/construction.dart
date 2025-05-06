// models/construction.dart
class Construction {
  final String name;
  final double lat;
  final double lng;

  Construction({required this.name, required this.lat, required this.lng});

  // JSON 데이터를 Dart 객체로 변환하는 팩토리 생성자
  factory Construction.fromJson(Map<String, dynamic> json) {
    return Construction(
      name: json['name'],
      lat: json['lat'].toDouble(),
      lng: json['lng'].toDouble(),
    );
  }
}
