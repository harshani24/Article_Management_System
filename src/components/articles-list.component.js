import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../util/firebase';

const Article = props => (
    <tr>
        <td>{props.article.username}</td>
        <td>{props.article.description}</td>
        <td>{props.article.article}</td>

        <td>
            <Link to={"/edit/" + props.articleid}>edit</Link> | <a href="#" onClick={() => { props.deleteArticle(props.article.id) }}>delete</a>
        </td>
    </tr>


)

export default class ArticlesList extends Component {
    constructor(props) {
        super(props);

        this.deleteArticle = this.deleteArticle.bind(this)

        this.state = { articles: [] };
    }

    componentDidMount() {

        const articleRef = firebase.database().ref('Article');
        articleRef.on('value', (snapshot) => {
            const articles = snapshot.val();


            const articleList = [];
            for (let id in articles) {
                articleList.push({ id, ...articles[id] });
            }


            console.log(articleList)
            this.setState({ articles: articleList })
            console.log(articles)




        });
    }

    deleteArticle(id) {

        const articleRef = firebase.database().ref('Article').child(id);
        articleRef.remove();

        this.setState({
            articles: this.state.articles.filter(el => el.id !== id)
        })
    }

    ArticleList() {
        return this.state.articles.map(currentarticle => {
            return <Article article={currentarticle} articleid={currentarticle.id} deleteArticle={this.deleteArticle} key={currentarticle.id} />;
        })
    }

    render() {
        return (
            <div>
                <h3>All Added Articles</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Article</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.ArticleList()}
                    </tbody>
                </table>
            </div>
        )
    }
}