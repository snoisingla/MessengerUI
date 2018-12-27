export default class Sender {
  constructor(contactNumber, name, imageDownloadUrl) {
    this.contactNumber = contactNumber;
    this.name = name;
    this.imageDownloadUrl = imageDownloadUrl;
  }

  static createSenderFromJson(friendJson) {
    return new Sender(
      friendJson.contactNumber,
      friendJson.name,
      friendJson.imageDownloadUrl
    );
  }
}
