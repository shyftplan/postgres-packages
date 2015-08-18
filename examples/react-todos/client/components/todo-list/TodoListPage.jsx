const {
  Navigation,
  State
} = ReactRouter;

TodoListPage = React.createClass({
  mixins: [ReactMeteorData, Navigation, State],

  getMeteorData() {
    // Get list ID from ReactRouter
    const listId = parseInt(this.getParams().listId, 10);

    // Subscribe to the tasks we need to render this component
    const tasksSubHandle = Meteor.subscribe("todos", listId);

    return {
      tasks: Todos.knex().where({ list_id: listId }).orderBy("created_at", "DESC").run(),
      list: Lists.knex().where({ id: listId }).run()[0],
      tasksLoading: ! tasksSubHandle.ready()
    };
  },

  render() {
    const list = this.data.list;
    const tasks = this.data.tasks;

    if (! list) {
      return <AppNotFound />;
    }

    return (
      <div className="page lists-show">
        <TodoListHeader
          list={list}
          showLoadingIndicator={this.data.tasksLoading} />

        <TodoListItems tasks={this.data.tasks} />
      </div>
    );
  }
});
