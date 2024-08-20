import AppError from '@shared/errors/AppError';
import { randomUUID } from 'node:crypto';
import Customer from '../../entities/Customer';

export default class FakeCustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: { name: string; email: string }): Promise<Customer> {
    const customer = new Customer();

    customer.id = randomUUID();
    customer.name = name;
    customer.email = email;

    const emailAlreadyExists = this.customers.find((customer) => customer.email === email);

    if (emailAlreadyExists) {
      throw new AppError('Email address already used.');
    }

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      (findCustomer) => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find((customer) => customer.name === name);

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find((customer) => customer.id === id);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find((customer) => customer.email === email);

    return customer;
  }
}
