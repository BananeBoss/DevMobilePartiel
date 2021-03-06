import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import ActorlistItem from '../components/ActorListItem';
import DisplayError from '../components/DisplayError';

import Colors from '../definitions/Colors';

import { getActors, getSearch } from '../api/theMovieDB';

const Search = ({ navigation, favActors }) => {

    const [actors, setActors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextOffset, setNextOffset] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);


    useEffect(() => {
        requestPopularActors(actors, nextOffset);
    }, []);


    /*const requestPopularActors = async (prevActors, offset) => {
        setIsRefreshing(true);
        setIsError(false);
        try {
            const theMovieDBSearchResult = await getActors(offset);
            setActors([...prevActors, ...theMovieDBSearchResult.results]);
            setNextOffset(zomatoSearchResult.page + 1);
        } catch (error) {
            setIsError(true);
            setActors([]);
        }
        setIsRefreshing(false);
    };*/

    const requestPopularActors = async () => {
        setIsRefreshing(true);
        setIsError(false);
        try {
            const theMovieDBSearchResult = await getActors();
            setActors(theMovieDBSearchResult.results);
        } catch (error) {
            setIsError(true);
            setActors([]);
        }
        setIsRefreshing(false);
    };

    const requestActors = async () => {
        setIsRefreshing(true);
        setIsError(false);
        try {
            const theMovieDBSearchResult = await getSearch();
            setActors(theMovieDBSearchResult.person_results);
        } catch (error) {
            setIsError(true);
            setActors([]);
        }
        setIsRefreshing(false);
    };

    const searchActors = () => {
        Keyboard.dismiss();
        requestActors([], 0);
    }

    const navigateToActorDetails = (actorsID) => {
        navigation.navigate("ViewActor", { actorsID });
    };

    const amIaFavActor = (actorsID) => {
        if (favActors.findIndex(i => i === actorsID) !== -1) {
            return true;
        }
        return false;
    };

    /*const loadMoreActors = () => {
          requestRestaurants(restaurants, nextOffset);
      };*/

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Nom de l'acteur"
                    style={styles.inputActorName}
                    onChangeText={(text) => setSearchTerm(text)}
                    onSubmitEditing={searchActors}
                />
                <Button
                    title='Rechercher'
                    color={Colors.mainGreen}
                    onPress={searchActors}
                />
                <Button
                    title='effacer'
                    color={Colors.mainGreen}
                    onPress={requestPopularActors}
                />
            </View>
            {
                isError ?
                    (<DisplayError message='Impossible de r??cup??rer les acteurs' />) :
                    (<FlatList
                        data={actors}
                        extraData={favActors}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ActorlistItem
                                actorData={item}
                                onClick={navigateToActorDetails}
                                isFav={amIaFavActor(item.id)} />
                        )}
                        refreshing={isRefreshing}
                        //onEndReached={loadMoreActors}
                        //onEndReachedThreshold={0.5}
                    />)
            }
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        favActors: state.favActorsID
    }
}

export default connect(mapStateToProps)(Search);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        marginTop: 16,
    },
    searchContainer: {
        marginBottom: 16,
    },
    inputActorName: {
        marginBottom: 8,
    },
});