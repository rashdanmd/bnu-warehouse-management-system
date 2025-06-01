export class Supplier {
  constructor(
    public id: string,
    public name: string,
    public contactEmail: string
  ) {
    if (!Supplier.isValidEmail(contactEmail))
      throw new Error("Not a valid email address");

    if (!Supplier.isValidName(name)) throw new Error("Not a valid name");
  }

  public getSupplierDetails(): string {
    return `Supplier ID: ${this.id}, Name: ${this.name}, Contact: ${this.contactEmail}`;
  }

  public updateContactEmail(newEmail: string): void {
    if (!Supplier.isValidEmail(newEmail))
      throw new Error("Not a valid email address");

    this.contactEmail = newEmail;
  }

  public static isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  public static isValidName(name: string): boolean {
    const validName = /^[a-zA-Z0-9\s&.,'()\-]{2,50}$/.test(name.trim());
    return validName;
  }
}
