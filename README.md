# Express app
A simple express application made with typescript.

## Compile application
    npm run build

## Start application
    npm run start

## Start linter
    npm run lint

## Format code
    npm run format


## Recommended readings and videos
This template use DDD (Hexagonal architecture or ports and adapter architecture) to organize code.

> [![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/eNFAJbWCSww/0.jpg)](https://www.youtube.com/watch?v=eNFAJbWCSww)

### Domain
This layer is the core of the application. Here are defined the business entities ej.

Imagine that you want to create a blog:

The main entities could be
- User
- Post

#### Value objects
These entities have attributes that can have their own logic. For example user have a username.
A `username` have a requirements to be valid. This where a value object comes from.

Then you create a class named `Username`. In this class you define the requirements of a `username`.
This allows you to have a single source of truth that verifies if the username is valid or no.

> There are more advantages about value objects but this is the most important. It's recommended to read
> more about value objects.

#### Repositories
In domain, you define your interfaces for repositories. If you have users you want a way to handle the persistence
of you users. But as we mentioned domain only handles core entities and business logic. Then you can use repository
pattern.

This patterns says that you define your repositories as interfaces. Then in infrastructure layer you define
the implementation of that repositories that adapts to your infrastructure.
ej.

- Domain
  - `UserRepository`: This interface define the methods and allowed ways to interact to your user persistence system. But no how you do that.
- Infrastructure
  - `MysqlUserRepository`: This class implements `UserRepository` and specify how to interact with mysql. Applying `UserRepository` methods.

### Application
In this layer is defined the `actions` and `use-cases` of your application. For example, your application can
create users, can add posts, remove them, etc.

Then you define your `Actions` that handle this logic.
ej.

If you want a feature that allow to create a user you could define a class like `CreateUserAction`.
This class is the responsible for create a user. Handling possible errors and edge-cases.
As you can see this is independent of any framework, library, network protocol user interaction method.
This only handles logic not data IO.

### Infrastructure
This layer defines the details about the data IO of your application.

- Which database you will use?
- Which protocol and standard api are going to use to interact with you frontend? HTTP? gRPC? REST? GraphQL?
- Which framework is needed for that?

## More readings
- Screaming architecture
- Vertical slicing

